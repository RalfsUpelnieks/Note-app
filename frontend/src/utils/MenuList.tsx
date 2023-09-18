import PageTitle from "../components/editableComp/pageTitle";
import Heading from "../components/editableComp/heading";
import Subheading from "../components/editableComp/subheading";
import Paragraph from "../components/editableComp/paragraph";
import checklist from "../components/editableComp/checklist"

const menuList = [
    {
        id: "page-title",
        tag: PageTitle,
        label: "Page Title",
    },{
        id: "heading",
        tag: Heading,
        label: "Heading",
    },{
        id: "subheading",
        tag: Subheading,
        label: "Subheading",
    },{
        id: "p",
        tag: Paragraph,
        label: "Paragraph",
    },{
        id: "checklist",
        tag: checklist,
        label: "Checklist",
    },
];

export default menuList;