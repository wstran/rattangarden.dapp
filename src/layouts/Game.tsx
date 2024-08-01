

function InGame({ children }: { children: JSX.Element }) {
    return (
        <div className="flex flex-col items-center justify-center">
            {children}
        </div>
    );
}

export default InGame;