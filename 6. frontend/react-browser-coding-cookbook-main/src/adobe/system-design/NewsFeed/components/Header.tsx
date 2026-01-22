interface Props {
  userId: string;
}

const Header = ({
  userId,
}: Props) => {
  return (
    <div className="post-header">
      <div>Anup Gupta</div>
      <div>UserId : {userId}</div>
    </div>
  )
}

export default Header;