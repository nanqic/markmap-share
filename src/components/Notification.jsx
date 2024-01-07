
const Notification = ({ type, msg }) => {

    switch (type) {
        case 'err':
            return (
                <div className={`rounded-s bg-neutral-50 text-red-600 px-4 py-3 shadow-md absolute top-1 right-1`} role="alert">
                    <div className="flex w-80 items-center">
                        ❌ <p className="text-sm pl-2">{msg}</p>
                    </div>
                </div>
            );

        default:
            return (
                <div className={`rounded-s bg-neutral-50 text-teal-900 px-4 py-3 shadow-md absolute top-1 right-1`} role="alert">
                    <div className="flex w-80 items-center">
                        ✅ <p className="text-sm pl-2">{msg}</p>
                    </div>
                </div>
            );
    }



};

export default Notification;
