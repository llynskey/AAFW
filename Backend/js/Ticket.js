class User{
    constructor(FirstName,LastName,Email,Username,Pass,Type)
    {
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Email = Email;
        this.Username = Username;
        this.Password = this.Password;
        this.Type = Type;
    }  
        getFullName(){
            return this.FirstName + this.LastName;
        }
}
module.exports = User;
