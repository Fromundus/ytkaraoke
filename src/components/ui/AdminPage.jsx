import React from 'react'

const AdminPage = ({ children, className }) => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className={`${className} p-6`}>
      {children}
    </div>
  )
}

export default AdminPage
