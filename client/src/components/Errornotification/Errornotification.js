import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { clearErrorsUser } from '../../JS/Actions/user';
import { ToastContainer, toast } from 'react-toastify';

const Errornotification = ({error}) => {
  const [show, setshow] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      setshow(false);
      dispatch(clearErrorsUser());
    }, 3000);
  }, [show, dispatch]);

  const customId = "";
  return (
    <div>
    {show && (
      <div>
        {toast.error(error.msg, { toastId: customId })}
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          draggable
          className="toast-text"
          theme="dark"
          limit={1}
          
        />
      </div>
    )}
    </div>
  )
}

export default Errornotification