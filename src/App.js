import './App.css'
import {Component} from 'react'
import {Switch, Redirect, Route} from 'react-router-dom'
import ThemeContext from './context/ThemeContext'
import HomeRoute from './components/HomeRoute'
import LoginRoute from './components/LoginRoute'
import NotFound from './components/NotFound'
import GamingRoute from './components/GamingRoute'
import SavedVideos from './components/SavedVideos'
import TrendingRoute from './components/TrendingRoute'
import VideoItemDetailsRoute from './components/VideoItemDetailsRoute'
import ProtectedRoute from './components/ProtectedRoute'

class App extends Component {
  state = {
    isLightTheme: true,
    selectedRoute: '/',
    savedVideosList: [],
    likedVideosList: [],
    disLikedVideosList: [],
  }

  changeTheme = () => {
    this.setState(prevState => ({isLightTheme: !prevState.isLightTheme}))
  }

  onSelectedRoute = route => {
    this.setState({selectedRoute: route})
  }

  videoLiked = id => {
    const {likedVideosList, disLikedVideosList} = this.state
    if (likedVideosList.includes(id) === false) {
      if (disLikedVideosList.includes(id)) {
        this.setState({
          disLikedVideosList: disLikedVideosList.filter(each => each !== id),
          likedVideosList: [...likedVideosList, id],
        })
      } else {
        this.setState({
          likedVideosList: [...likedVideosList, id],
        })
      }
    } else {
      this.setState({
        likedVideosList: likedVideosList.filter(each => each !== id),
      })
    }
  }

  videoDisLiked = id => {
    const {likedVideosList, disLikedVideosList} = this.state
    if (disLikedVideosList.includes(id) === false) {
      if (likedVideosList.includes(id)) {
        this.setState({
          likedVideosList: likedVideosList.filter(each => each !== id),
          disLikedVideosList: [...disLikedVideosList, id],
        })
      } else {
        this.setState({
          disLikedVideosList: [...disLikedVideosList, id],
        })
      }
    } else {
      this.setState({
        disLikedVideosList: disLikedVideosList.filter(each => each !== id),
      })
    }
  }

  saveVideo = videoDetailObject => {
    const {savedVideosList} = this.state
    const isVideoSaved = savedVideosList.find(
      each => videoDetailObject.id === each.id,
    )
    let updatedSavedVideoList
    if (isVideoSaved) {
      updatedSavedVideoList = savedVideosList.filter(
        each => each.id !== videoDetailObject.id,
      )
    } else {
      updatedSavedVideoList = [...savedVideosList, videoDetailObject]
    }

    this.setState({
      savedVideosList: [...updatedSavedVideoList],
    })
  }

  render() {
    const {
      isLightTheme,
      selectedRoute,
      savedVideosList,
      disLikedVideosList,
      likedVideosList,
    } = this.state
    console.log(savedVideosList)
    return (
      <ThemeContext.Provider
        value={{
          isLightTheme,
          changeTheme: this.changeTheme,
          selectedRoute,
          onSelectedRoute: this.onSelectedRoute,
          savedVideosList,
          saveVideo: this.saveVideo,
          likedVideosList,
          videoLiked: this.videoLiked,
          disLikedVideosList,
          videoDisLiked: this.videoDisLiked,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginRoute} />
          <ProtectedRoute exact path="/" component={HomeRoute} />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoItemDetailsRoute}
          />
          <ProtectedRoute exact path="/trending" component={TrendingRoute} />
          <ProtectedRoute exact path="/gaming" component={GamingRoute} />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </ThemeContext.Provider>
    )
  }
}

export default App
