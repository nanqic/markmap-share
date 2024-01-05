
export default function WanrMsg({ show, msg }) {

    return (
        <div className={`bg-orange-500 text-white p-4 ${show ? 'block' : 'hidden'} fixed top-0 left-0 w-full text-center`}>
            {msg}
        </div>
    )
}
