import { useEffect, useState } from "react"
import GridPageLayout from "../../Components/GridPageLayout"

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("jwtToken");
                const resp = await fetch("/api/v1/users/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token
                    }
                });
                const user = await resp.json();
                setUser(user);
            } catch(err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    if (loading) return <div>Loading........</div>

    return (
        <GridPageLayout>
            <div>
                <h3>{user?.firstName}</h3>
                <p>Email: <span>{user?.email}</span></p>
            </div>
        </GridPageLayout>
    )
}

export default Dashboard;
