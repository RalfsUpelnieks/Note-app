import PageTitle from "../components/notes/editableComp/pageTitle";
import Heading from "../components/notes/editableComp/heading";
import Subheading from "../components/notes/editableComp/subheading";
import Paragraph from "../components/notes/editableComp/paragraph";
import Checklist from "../components/notes/editableComp/checklist";
import VideoEmbed from "../components/notes/editableComp/videoEmbed";
import Divider from "../components/notes/editableComp/divider";
import BulletPoint from "../components/notes/editableComp/bulletPoint";
import NumberedList from "../components/notes/editableComp/numberedList";
import File from "../components/notes/editableComp/file";

const BLOCK_LIST = [
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
        id: "bulletpoint",
        tag: BulletPoint,
        properties: {"text": ""},
        label: "Bulletpoint",
    },{
        id: "numberlist",
        tag: NumberedList,
        properties: {"text": "", "number": "1"},
        label: "Numberlist",
    },{
        id: "checklist",
        tag: Checklist,
        properties: {"text": "", "checkbox": false},
        label: "Checklist",
    },{
        id: "divider",
        tag: Divider,
        properties: null,
        label: "Divider"
    },{
        id: "file",
        tag: File,
        properties: {"filename": ""},
        label: "File"
    },{
        id: "videoEmbed",
        tag: VideoEmbed,
        properties: {"text": ""},
        label: "Embed"
    }
];

export default BLOCK_LIST;