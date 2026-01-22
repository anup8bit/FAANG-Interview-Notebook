import { Suspense } from "react";
import { useFetchData } from "../../hooks/useFetchData"
import GridPageLayout from "../../Components/GridPageLayout";
import "./index.css";

const UserList = () => {
    const {data, error, loading} = useFetchData("https://jsonplaceholder.typicode.com/users");

    if (error) {
        return <div>Error in fetching users</div>
    }
    
    return (
        <div>
            <div>Users List</div>
            <div className="users-list-container">
                {
                    data?.map((user: any) => (
                        <div className="user-card" key={user.id}>{user.name}</div>
                    ))
                }
            </div>
        </div>
    )
}

export default UserList;