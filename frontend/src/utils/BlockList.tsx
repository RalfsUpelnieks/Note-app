import PageTitle from "../components/editableComp/pageTitle";
import Heading from "../components/editableComp/heading";
import Subheading from "../components/editableComp/subheading";
import Paragraph from "../components/editableComp/paragraph";
import Checklist from "../components/editableComp/checklist";
import VideoEmbed from "../components/editableComp/videoEmbed";
import Divider from "../components/editableComp/divider";
import BulletPoint from "../components/editableComp/bulletPoint";
import NumberedList from "../components/editableComp/numberedList";
import File from "../components/editableComp/file";

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