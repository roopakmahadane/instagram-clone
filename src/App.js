import React, {useState, useEffect} from 'react';
import './App.css';
import Post from "./Post"
import { db,auth } from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input, Avatar } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}


function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)
  const [openFileUpload, setOpenFileUpload] = useState(false)

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser)
        setUser(authUser)

      }else{
        setUser(null)
      }
    })

    return () => {
      unSubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc =>({
        id: doc.id,
        post:doc.data()
      })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .then(() => setOpen(false))
    .catch(err => alert(err.message))
  }

  const login = (e) => {
    e.preventDefault();
   auth.signInWithEmailAndPassword(email, password)
   .then(user => {
     setOpenLogin(false)
   })
   .catch(err => console.log(err))
  }
  return (
    <div className="app">
    {(user?.displayName) ?
      <Modal
        open={openFileUpload}
        onClose={() => setOpenFileUpload(false)}
        > 
        <div style={modalStyle} className={classes.paper}>
        <ImageUpload username={user.displayName}/> 
        </div>
    
      </Modal>
      : null
      
    }
    
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      > 
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
          <center>
          <img 
              className="app__headerImage" 
              src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
             </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={signUp}>SignUp</Button>
         
      </form>
      
    </div>
      </Modal>
      <Modal open={openLogin} onClose={() => setOpenLogin(false)}>
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
          <center>
          <img 
              className="app__headerImage" 
              src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
             </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={login}>SignUp</Button>
         
      </form>
      
    </div>
      </Modal>
      <div className="app__header">
        <img 
          className="app__headerImage" 
          src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
            {(!user)?
              <h3>Login to upload</h3> : null
            }
          {user ? (
             <div className="app__auth">
             <Avatar 
            className="post__avatar"
            alt={user.displayName}
            src="/static/images/avatar/1.jpg" 
        />
            <Button onClick={()=>auth.signOut()}>LogOut!</Button>
            <Button onClick={() => setOpenFileUpload(true)}>Add a post!</Button>
             </div>
       
          ) : (
            <div className="app__loginContainer">
            <Button onClick={()=>setOpen(true)}>Signup</Button>
            <Button onClick={()=>setOpenLogin(true)}>Login</Button>
          
            </div> 
          )}
          
      </div>
      <div className="app__body">
            <div className="appbody__left">
            {posts.map(({id, post}) => {
        return <Post user={user} key={id} userName={post.userName} caption={post.caption} imageUrl={post.imageUrl} postId={id}/>
      })}
            </div>
            <div className="appbody__right">
            <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
            </div>
     
     
      </div>

    </div>
  );
}

export default App;
