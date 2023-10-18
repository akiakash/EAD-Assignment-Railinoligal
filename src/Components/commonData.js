import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    isAuthenticated: false,
    id:'',
    name:'',
    email:'',
    nic:'',
    phone:'',
    userType:'',
    isActive:'',
  });

  const[train,setTrain] = useState({
    isCreateTrain:false,
    id: "",
    trainName: "",
    scheduleDateTime: "",
    seatsCount: "",
    from: "",
    to: ""
  })

  return (
    <UserContext.Provider value={{ user, setUser, train, setTrain}}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
