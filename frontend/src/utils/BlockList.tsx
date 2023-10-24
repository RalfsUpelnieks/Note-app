import PageTitle from "../components/editableComp/pageTitle";
import Heading from "../components/editableComp/heading";
import Subheading from "../components/editableComp/subheading";
import Paragraph from "../components/editableComp/paragraph";
import Checklist from "../components/editableComp/checklist";
import VideoEmbed from "../components/editableComp/videoEmbed";
import Divider from "../components/editableComp/divider";

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
        tag: Checklist,
        properties: {"text": "", "checkbox": false},
        label: "Checklist",
    },{
        id: "videoEmbed",
        tag: VideoEmbed,
        properties: {"text": ""},
        label: "videoEmbed"
    },{
        id: "divider",
        tag: Divider,
        properties: null,
        label: "Divider"
    }
];

export default blockList;