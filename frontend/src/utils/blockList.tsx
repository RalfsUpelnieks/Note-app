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
import MenuIcon from "../components/menus/menuIcon";
import { IconH1, IconH2, IconH3, IconParagraph, IconListBulleted, IconListNumbered, IconChecklist, IconFile, IconCode, IconDivider } from "../icons";

const BLOCK_LIST = [
    {
        id: "h1",
        tag: PageTitle,
        properties: {"text": ""},
        label: "Page Title",
        icon: <MenuIcon><IconH1 width={20} height={20}/></MenuIcon>
    },{
        id: "h2",
        tag: Heading,
        properties: {"text": ""},
        label: "Heading",
        icon: <MenuIcon><IconH2 width={20} height={20}/></MenuIcon>
    },{
        id: "h3",
        tag: Subheading,
        properties: {"text": ""},
        label: "Subheading",
        icon: <MenuIcon><IconH3 width={20} height={20}/></MenuIcon>
    },{
        id: "p",
        tag: Paragraph,
        properties: {"text": ""},
        label: "Paragraph",
        icon: <MenuIcon><IconParagraph width={20} height={20}/></MenuIcon>
    },{
        id: "bulletpoint",
        tag: BulletPoint,
        properties: {"text": ""},
        label: "Bulletpoint",
        icon: <MenuIcon><IconListBulleted width={20} height={20}/></MenuIcon>
    },{
        id: "numberlist",
        tag: NumberedList,
        properties: {"text": "", "number": "1"},
        label: "Numberlist",
        icon: <MenuIcon><IconListNumbered width={20} height={20}/></MenuIcon>
    },{
        id: "checklist",
        tag: Checklist,
        properties: {"text": "", "checkbox": false},
        label: "Checklist",
        icon: <MenuIcon><IconChecklist width={20} height={20}/></MenuIcon>
    },{
        id: "divider",
        tag: Divider,
        properties: null,
        label: "Divider",
        icon: <MenuIcon><IconDivider width={20} height={20}/></MenuIcon>
    },{
        id: "file",
        tag: File,
        properties: {"filename": ""},
        label: "File",
        icon: <MenuIcon><IconFile width={20} height={20}/></MenuIcon>
    },{
        id: "videoEmbed",
        tag: VideoEmbed,
        properties: {"text": ""},
        label: "Embed",
        icon: <MenuIcon><IconCode width={20} height={20}/></MenuIcon>
    }
];

export default BLOCK_LIST;