import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/authProvider';
import { ConfirmationProvider } from './contexts/confirmationProvider';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <BrowserRouter>
        <AuthProvider>
            <ConfirmationProvider>
                <App />
            </ConfirmationProvider>
        </AuthProvider>
    </BrowserRouter>
);