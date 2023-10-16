import PageTitle from "../components/editableComp/pageTitle";
import Heading from "../components/editableComp/heading";
import Subheading from "../components/editableComp/subheading";
import Paragraph from "../components/editableComp/paragraph";
import checklist from "../components/editableComp/checklist"

const blockList = [
    {
        id: "h1",
        tag: PageTitle,
        properties: {"text": ""},
        label: "Page Title",
    },{
        id: "h2",
        tag: Heading,
        properties: {"text": ""},
        label: "Heading",
    },{
        id: "h3",
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

export default blockList;