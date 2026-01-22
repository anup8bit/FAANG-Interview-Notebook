function withLoader(Component) {
    return function({loading, ...props}) {
        if (loading) return <>Loading......</>

        return <Component {...props} />
    }
}

export default withLoader;
