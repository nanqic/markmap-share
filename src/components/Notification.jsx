
const Notification = ({ text }) => {

    return (
        <div className={`rounded-s bg-neutral-50 text-teal-900 px-4 py-3 shadow-md absolute top-1 right-1`} role="alert">
            <div className="flex w-80 items-center">
                ✅ <p className="text-sm pl-2">{text}</p>
            </div>
        </div>
    );
};

export default Notification;
