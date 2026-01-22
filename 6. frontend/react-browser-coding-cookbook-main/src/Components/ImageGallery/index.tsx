import { ReactElement, ReactNode, useEffect, useState } from "react"
import Card, { CardProps } from "../Card"
import { useFetchData } from "../../hooks/useFetchData";
import LazyImage from "../LazyImage";
import "./index.css";

interface UserProps {
login: string;
id: string;
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
site_admin: string;
}


const ImageGallery = () => {
  const {data, error, loading} = useFetchData("https://api.github.com/users?per_page=5000");

  if (loading) return <p>Loading......</p>

  const ViewCta = ({ url }: {url: string}): ReactElement => (
    <div>
      <a href={url}>View Github Profile</a>
    </div>
  )

  return (
    <div className="image-gallery-container">
      {(data as unknown as UserProps[])?.map((item) => (
        <Card
          title={item.login}
          subTitle={item.user_view_type}
          footerElement={<ViewCta url={item.html_url} />}
        >
          <LazyImage src={item.avatar_url} alt="alt" />
        </Card>
      ))}
    </div>
  )
}

export default ImageGallery;