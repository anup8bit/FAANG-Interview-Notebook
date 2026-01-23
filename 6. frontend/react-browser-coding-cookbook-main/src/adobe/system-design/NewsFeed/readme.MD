NewsFeedPage
  |--PostItem
     |--Header
        |--UserProfilePic + userName + timestamp
        Body
        |--<TextBody> (with read more functionality)
         --<Links> at bottom
        |--<MediaFiles>
        Footer
        |--<LikeButton />
         --<CommentButton />
         --<ShareButton />

# State Management #
this feature ->
ueReducer should be fine | but for social media application Redux will be recommended
some state will be local if required

# API Integration #
/feed?page=0&limit=10
/current-user
/posts/:id ----- to get post
/posts/:id/likes
/posts/:id/comments


### Data ###

# Models #
interface User {
  id: number;
  fName: string;
  lName?: strig;
  createdAt: String;
  userName: string;
  profilePicUrl?: string;
}

interface Post {
  id: number;
  text: string;
  files: string[];
  likes: number;
  comments: string[];
  createdAt: string;
  user: User
}