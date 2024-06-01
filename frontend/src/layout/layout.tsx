interface LayoutProps {
    topNavChildren: React.ReactNode,
    sideNavChildren: React.ReactNode,
    children: React.ReactNode
}

function Layout({topNavChildren, sideNavChildren, children} : LayoutProps) {

    return (
        <div className='h-full'>
            <div className='flex h-full flex-col'>
            {topNavChildren}
            <div className='flex overflow-hidden h-full'>
                {sideNavChildren}
                <main className="w-full flex flex-col">
                    <div className="contents">
                        <div id="MainContent" className="overflow-y-auto flex flex-col items-center">
                            {children}
                        </div>
                    </div> 
                </main>
            </div>
        </div>
        </div>
        
    );
};

export default Layout;