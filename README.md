## About :
<p>This is the backend part of <span></span><h5>Chatify</h5></span> project. In the project I used MVC file sturcture and it is a REST api based application.  For web socket I used Socket.io and for faile handling used Multer  Package. Also have user other packages like JWT and Bcrypt for security. </p>
<br/>
## Frontend portion of the Project : https://github.com/Rounak00/Chatify_client
<br/><br/>

<h4>Concepts : </h4>
<ul>
  <li>All Routes in the Project :<br/>
       <ol>http://loaclhost:5000/login : For log in user</ol>
       <ol>http://loaclhost:5000/signup : For sign up user</ol>
       <ol>http://loaclhost:5000/userInfo : For get the user information after log in or sign up</ol>
       <ol>http://loaclhost:5000/update_profile : For update user Profile</ol>
       <ol>http://loaclhost:5000//add_profile_image : For update user Profile Image {adding profile pic}</ol>
       <ol>http://loaclhost:5000/remove_profile_image : For update user Profile Image {removing profile pic}</ol>
       <ol>http://loaclhost:5000/logout : For user logout</ol>
       <ol>http://loaclhost:5000/message/get_messages : Fetch all previous messages of a contact</ol>
       <ol>http://loaclhost:5000/message/get_channel_messages/:channelId : Fetch all previous messages of a channel</ol>
       <ol>http://loaclhost:5000/message/upload_file : Upload any file in any coversation </ol>
       <ol>http://loaclhost:5000/contact/search : Search another users </ol>
       <ol>http://loaclhost:5000/contact/get_contacts_for_DM : Fetch all contacts with whom we had conversation </ol>
       <ol>http://loaclhost:5000/contact/get_all_contacts : Fetch all users</ol>
       <ol>http://loaclhost:5000/contact/create_channel : Create channel </ol>
       <ol>http://loaclhost:5000/contact/get_user_channels : Fetch all channels that are joined by user </ol>
 </li>
<li>
   Multer : I use multer for save all files in loacl machine.
</li>
<li>
     MongoDB : Here we simple record all the file's name, local machine store path, file Id [default], count of download that file.
  </li>
  
</ul>



