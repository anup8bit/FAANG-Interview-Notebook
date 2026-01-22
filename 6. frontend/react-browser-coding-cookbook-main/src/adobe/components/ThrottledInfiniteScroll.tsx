/**
 * Infinite Scroll
 * 
 * call api when scroll reaches the bottom of view port
 * 
 * to identify the intersection of scroll with bottom of viewport
 *      -> use IntersectionObserver
 * 
 * api call should be throttled
 * 
 * observe for last element in the list (apply ref on it) as it comes in viewport
 */

import { RefObject, useEffect, useRef, useState } from "react";
import { useFetchData } from "../../hooks/useFetchData";
import useThrottle from "../hooks/useThrottle";

export interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
}

interface UserCardProps {
    user: GitHubUser;
    isLast: boolean;
    obRef: RefObject<HTMLDivElement | null>;
}

const UserCard = ({
    user,
    obRef,
    isLast,
}: UserCardProps) => {
    const ref = isLast ? obRef : null;
    return (
        <div ref={ref}  key={user.id} className="card">
            <div>
                username - {user.login}
            </div>
            <div>
                id - {user.id}
            </div>
            <div>github profile - {user.html_url}</div>
        </div>
    )
}

const ThrottledInfiniteScroll = () => {
    const [page, setPage] = useState(0);
    const [data, setData] = useState<GitHubUser[]>([]);

    const obRef = useRef<HTMLDivElement | null>(null);

    const throttledPage = useThrottle(page, 1000);

    const {data: resData, loading, error} = useFetchData(
        `https://api.github.com/users?page=${throttledPage}&per_page=10`
    );

    useEffect(() => {
        const intersectionObserverCallback: IntersectionObserverCallback = (entries, obs) => {
            entries.forEach((entry, index) => {
                console.log("entry : ", entry);
                if (entry.isIntersecting) {
                    setPage(page+1);
                    obs.unobserve(entry.target);
                }
            });
        }

        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: "-50px",
        }

        const observer = new IntersectionObserver(intersectionObserverCallback, options);
        if (obRef.current) observer.observe(obRef.current);

        return () => {
            if(obRef.current) observer.unobserve(obRef.current);
            observer.disconnect();
        }
        
    }, [data]);

    useEffect(() => {
        if (resData) {
            setData([...data, ...resData as unknown as GitHubUser[]])
        }
    }, [resData]);

    return (
        <div>
            <h3>Users list with pagination</h3>
            <div>
                {data.map((user, index) => (
                    <UserCard
                        user={user}
                        obRef={obRef}
                        isLast={index===data.length-1}
                    />
                ))}
            </div>
        </div>
    )
}

export default ThrottledInfiniteScroll;
