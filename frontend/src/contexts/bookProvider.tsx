import { createContext, useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import useAuth from "../hooks/useAuth";
import objectId from "../utils/objectId";
import { GetTimeISO } from "../utils/timeConverter";
import useConfirmation from "../hooks/useConfirmation";
import COLORS from "../utils/colors";
import ROUTES from "../utils/routePaths";
import PLACEHOLDERS from "../utils/placeholders";

const BookContext = createContext({});

export const BookProvider = ({ children }) => {
    const { LogOut } : any = useAuth()
    const { id } = useParams()
    const navigate = useNavigate();
    const { OpenDeletionConfirmation } : any = useConfirmation();

    const [loading, setLoading] = useState(true);
    const [books, setBooks] = useState<any>([]);

    const initialized = useRef(false);

    const initialize = async () => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (initialized.current) {
          return;
        }
    
        initialized.current = true;

        api.get("/api/Note/GetBookData").then(response => {
            if (response?.ok) {
                response?.json().then(data => { 
                    console.log("Get page data from server");
                    setLoading(false);
                    setBooks(data.map(b => ({...b, createdAt: b.createdAt + 'Z', lastUpdatedAt: b.lastUpdatedAt + 'Z', open: false})))
                });
            } else if (response?.status === 401) {
                LogOut();
            } else {
                setLoading(false);
            }
        })
    }
    
    useEffect(() => {
        initialize();
    }, []);

    function OpenViewBooks(){
        navigate(ROUTES.AllBooks);
    }

    function OpenBook(bookId: string) {
        navigate(`${ROUTES.Book}/${bookId}`); 
    }

    function OpenPage(pageId: string) {
        var bookIndex = books.findIndex(b => b.pages.map(p => p.pageId).includes(pageId));
        if(bookIndex != -1){
            const updatedBooks = [...books];
            updatedBooks[bookIndex].open = true
            setBooks(updatedBooks)
        }
        
        navigate(`${ROUTES.Page}/${pageId}`);
    }

    async function AddBook() {
        var bookId = objectId();
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

        api.post("/api/Note/AddBook", JSON.stringify({BookId: bookId, Title: "", Description: "", Color: randomColor.id, Position: books.length + 1})).then(response => {
            if (response?.ok) {
                console.log("Book added");
                setBooks([ ...books, {bookId: bookId, title: "", description: "", color: randomColor.id, pages: [], open: true, lastUpdatedAt: GetTimeISO(), createdAt: GetTimeISO()}]);
                OpenBook(bookId);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    async function AddPage(bookId: string) {
        var pageId = objectId();

        const bookIndex = books.findIndex(book => book.bookId === bookId);
        if(bookIndex !== -1){
            api.post("/api/Note/AddPage", JSON.stringify({PageId: pageId, Title: "", BookId: bookId, Position: books[bookIndex].pages.length + 1})).then(response => {
                if (response?.ok) {
                    console.log("Page added");
                    const updatedBooks = [...books];
                    updatedBooks[bookIndex] = {
                        ...updatedBooks[bookIndex],
                        lastUpdatedAt: GetTimeISO(),
                        pages: [...updatedBooks[bookIndex].pages, { pageId: pageId, title: "", lastUpdatedAt: GetTimeISO(), createdAt: GetTimeISO()}],
                        open: true
                    };
                    setBooks(updatedBooks);
                    OpenPage(pageId);
                } else if (response?.status == 401) {
                    LogOut();
                }
            });
        }
    }

    async function updateBook(bookId: string, title: string, description: string, color: string, position: number = -1) {
        const result = await api.put("/api/Note/UpdateBook", JSON.stringify({bookId: bookId, title: title, description: description, color: color, position: position})).then(response => {
            if (response?.ok) {
                console.log("Book updated");

                setBooks(books => books.map(book => {
                    if (book.bookId === bookId) {
                        return {
                            ...book,
                            lastUpdatedAt: GetTimeISO(),
                        };
                    }

                    return book;
                }));

                return true;
            } else if (response?.status == 401) {
                LogOut();
            }

            return false
        });

        return result;
    };

    async function updatePage(pageId: string, bookId: string, title: string, position: number = -1) {
        const bookIndex = books.findIndex(b => b.bookId == bookId);
        if(bookIndex === -1) {
            return false
        }

        const pageIndex = books[bookIndex].pages.findIndex(p => p.pageId == pageId);
        if(pageIndex === -1) {
            return false
        }

        const result = await api.put("/api/Note/UpdatePage", JSON.stringify({pageId: pageId, bookId: bookId, title: title, position: position})).then(response => {
            if (response?.ok) {
                console.log("Page updated");

                const updatedBooks = [...books];
                updatedBooks[bookIndex].lastUpdatedAt = GetTimeISO();
                updatedBooks[bookIndex].pages[pageIndex].lastUpdatedAt = GetTimeISO();
                setBooks(updatedBooks);

                return true;
            } else if (response?.status == 401) {
                LogOut();
            }

            return false
        });

        return result
    };

    async function RemoveBookRequest(bookId: string) {
        api.delete(`/api/Note/RemoveBook/${bookId}`).then(response => {
            if (response?.ok) {
                console.log("Page removed");
                
                if(bookId === id){
                    OpenViewBooks();
                }

                var bookIndex = books.findIndex(b => b.pages.map(p => p.pageId).includes(id));
                if(bookIndex != -1){
                    if (books[bookIndex].bookId == bookId){
                        OpenViewBooks();
                    }
                }

                setBooks(books.filter(book => book.bookId !== bookId));
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    function RemoveBook(book) {
        OpenDeletionConfirmation(() => RemoveBookRequest(book.bookId), `book "${book.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.book}"`);
    }

    async function RemovePageRequest(pageId: string, bookId: string){
        api.delete(`/api/Note/RemovePage/${pageId}`).then(response => {
            if (response?.ok) {
                console.log("Page removed");
                if(pageId === id){
                    OpenViewBooks();
                }
                setBooks(prevBooks => prevBooks.map(book => {
                    if (book.bookId === bookId) {
                      return {
                        ...book,
                        lastUpdatedAt: GetTimeISO(),
                        pages: book.pages.filter(page => page.pageId !== pageId)
                      };
                    }
                    return book;
                }));
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    function RemovePage(page, bookId) {
        OpenDeletionConfirmation(() => RemovePageRequest(page.pageId, bookId), `page "${page.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.page}"`);
    }

    async function ChangeOpen(bookId: string) {
        const updatedBooks = [...books];

        const bookIndex = books.findIndex(b => b.bookId == bookId);

        if(bookIndex !== -1) {
            updatedBooks[bookIndex] = {
                ...updatedBooks[bookIndex],
                open: !updatedBooks[bookIndex].open
            };
            setBooks(updatedBooks);
        }
    }
    
    return (
        <BookContext.Provider value={{ books, setBooks, OpenViewBooks, ChangeOpen, OpenBook, OpenPage, AddBook, updateBook, RemoveBook, AddPage, updatePage, RemovePage}}>
            {
                !loading
                    && children
            }
        </BookContext.Provider>
    )
}

export default BookContext;