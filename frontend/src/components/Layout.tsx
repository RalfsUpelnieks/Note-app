import Header from './Header';
import { Outlet } from 'react-router-dom';
import style from '../stylesheets/Layout.module.css';

export default function Layout() {
  //const [Page, ChangePage] = useState(false);

  // const handlePageChange = useCallback(
  //   () => {
  //     if (ChangePage) {
  //       setOpenNav(false);
  //     }
  //   },
  //   [openNav]
  // );

  return (
    <div>
      <Header />
      <div className={style.layoutRoot}>
        <div className={style.LayoutContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};