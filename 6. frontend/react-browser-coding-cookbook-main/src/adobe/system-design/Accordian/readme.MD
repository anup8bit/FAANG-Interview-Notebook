### Build an Accordion component that displays a list of vertically stacked sections that each contain a title and content snippet. Some HTML is provided for you as example contents along with a chevron icon.

**Requirements**
1. By default, all sections are collapsed and are hidden from view.
2. Clicking on a section title toggles the contents.
3. If the section is collapsed, the section will be expanded and the contents will be displayed.
4. If the section is expanded, the section will be collapsed and the contents will be hidden.
5. The sections are independent of each other.


types :
AccordianProps {
  title: ReactNode;
  open: boolean;
  toggle: () => void;
  content: ReactNode;
}

HeaderProps {
  title: ReactNode
}

Components:
Accordian
Header
  |--Title
   --Icon (Arrow Up and Down)
Content
  |--Render content (React Node)


states and props
1. open, setOpen(toggle) -> props
2. 