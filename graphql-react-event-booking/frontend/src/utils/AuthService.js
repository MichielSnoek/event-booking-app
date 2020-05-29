class AuthService {
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
      }
    
      loggedIn() {
        const user = this.getUser()
        return !!user;
      }
}
     
export default AuthService;