import { lazy, Suspense } from "react"
import Loading from "../../Components/Loading";

const UserList = lazy(() => import("../../Pages/UserList"))


const UserListWithSuspense = () => {
    return (
        <Suspense fallback={<Loading />}>
            <UserList />
        </Suspense>
    )
}

export default UserListWithSuspense;
