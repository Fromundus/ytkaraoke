import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: '57d7be453bac509eb7a6',
  cluster: 'ap1',
  forceTLS: true,
  encrypted: true,
  authEndpoint: 'http://localhost:8000/broadcasting/auth',
  withCredentials: true,
});

export default echo;