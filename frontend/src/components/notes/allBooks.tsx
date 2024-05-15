import useBooks from "../../hooks/useBooks";
import COLORS from "../../utils/colors";
import { ConvertTime } from "../../utils/timeConverter";
import PLACEHOLDERS from "../../utils/placeholders";

function AllBooks() {
    const { books, OpenBook, AddBook } : any = useBooks();

    return (
        <div className="max-w-4xl w-full">
            <p className="text-neutral-500 text-lg mb-0 bg-zinc-100 w-min px-2 border border-b-0 border-solid border-gray-200">Books</p>
            <table className="border-collapse w-full shadow-lg overflow-hidden border border-solid bg-white border-gray-200">
                <thead className="text-sm text-neutral-500 bg-zinc-100">
                    <tr className="text-left">
                        <th className="px-2 py-1 w-2/5">Name</th>
                        <th className="px-2 py-1 w-22 text-center">Color</th>
                        <th className="px-2 py-1 w-5 text-center">Pages</th>
                        <th className="px-2 py-1 text-center">Updated at</th>
                        <th className="px-2 py-1 text-center">Created at</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((Book: { bookId: string; pages: any; title: string; color: string; createdAt: string; lastUpdatedAt: string }) => {
                        return (
                            <tr key={Book.bookId} onClick={() => OpenBook(Book.bookId)}  className="border-0 group border-solid border-t border-gray-300 hover:bg-zinc-100 hover:cursor-pointer">
                                <td className="px-2 max-w-xs py-2 overflow-hidden whitespace-nowrap text-ellipsis group-hover:underline" dangerouslySetInnerHTML={{__html: Book.title.replaceAll("<br>", " ") || PLACEHOLDERS.book}}></td>
                                <td className="px-2 py-2 text-center">{COLORS.find(c => c.id == Book.color)?.name}</td>
                                <td className="text-center">{Book.pages.length}</td>
                                <td className="text-center">{ConvertTime(Book.lastUpdatedAt)}</td>
                                <td className="text-center">{ConvertTime(Book.createdAt)}</td>
                            </tr>
                        );
                    })}
                    <tr onClick={AddBook} className="border-0 border-solid border-t text-center border-gray-300 hover:bg-zinc-100 hover:cursor-pointer">
                        <td colSpan={6} className="py-2 text-neutral-400 hover:text-neutral-600">Add a Book</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default AllBooks