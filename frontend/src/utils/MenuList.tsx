import PageTitle from "../components/editableComp/pageTitle";
import Heading from "../components/editableComp/heading";
import Subheading from "../components/editableComp/subheading";
import Paragraph from "../components/editableComp/paragraph";
import checklist from "../components/editableComp/checklist"

const menuList = [
    {
        id: "page-title",
        tag: PageTitle,
        properties: {"text": ""},
        label: "Page Title",
    },{
        id: "heading",
        tag: Heading,
        properties: {"text": ""},
        label: "Heading",
    },{
        id: "subheading",
        tag: Subheading,
        properties: {"text": ""},
        label: "Subheading",
    },{
        id: "p",
        tag: Paragraph,
        properties: {"text": ""},
        label: "Paragraph",
    },{
        id: "checklist",
        tag: checklist,
        properties: {"text": "", "checkbox": false},
        label: "Checklist",
    },
];

export default menuList;