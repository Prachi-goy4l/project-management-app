import { useState } from "react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const handleClick = (e) => {
    e.preventDefault();
    if(!email || !pass) {
        alert("no email or pass")
        return ;
    }
    console.log(email);
    console.log(pass);
  };
  return (
    <>
      <div>
        <form action="" onSubmit={handleClick}>
          <h1>login page</h1>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p>{email}</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
          <p>{pass}</p>
          <button>Submit</button>
        </form>
      </div>
    </>
  );
}
