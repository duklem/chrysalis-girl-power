import React from "react";
import {
  ContentTypes,
  IPageFieldsItem,
  IPageItemFieldsItem,
  isIPage,
  isIPageFieldsItem,
} from "../@types/contentTypes";
import { IPage } from "../@types/generated/contentful";
import Announcement from "../components/Announcement";
import ContentSection from "../components/ContentSection";
import AnnouncementCollection from "./AnnouncementCollection";

type BlockRendererProps = {
  block: IPage | IPageFieldsItem | IPageItemFieldsItem;
};

const BlockRenderer: React.FC<BlockRendererProps> = ({ block }) => {
  let children: JSX.Element[] = [];

  const getKey = (content: BlockRendererProps['block']) => `${content.sys.contentType}-${content.sys.id}`;

  if (isIPage(block)) {
    // Render all page elements through BlockRenderer
    return (
      <>
        {block.fields.content.map((content) => (
          <BlockRenderer key={getKey(content)} block={content} />
        ))}
      </>
    );
  }

  if (isIPageFieldsItem(block)) {
    children = block.fields.content.map((content) => (
      <BlockRenderer key={getKey(content)} block={content} />
    ));
  }

  const contentTypeId = block.sys.contentType.sys.id;
  const Component = ContentTypeMap[contentTypeId];

  if (!Component) {
    console.warn(`${contentTypeId} can not be handled`);
    return null;
  }

  return (
    // @ts-ignore while we don't have all content types mapped to a component
    <Component key={getKey(block)} entry={block}>
      {children}
    </Component>
  );
};

const ContentTypeMap = {
  [ContentTypes.Announcement]: Announcement,
  [ContentTypes.AnnouncementCollection]: AnnouncementCollection,
  [ContentTypes.ContentSection]: ContentSection,
  [ContentTypes.Event]: null,
  [ContentTypes.EventCalendar]: null,
  [ContentTypes.ExternalResource]: null,
  [ContentTypes.Facilitator]: null,
  [ContentTypes.FacilitatorCollection]: null,
  [ContentTypes.NavigationItem]: null,
  [ContentTypes.NavigationMenu]: null,
  [ContentTypes.Newsletter]: null,
  [ContentTypes.Resource]: null,
  [ContentTypes.ResourceCollection]: null,
};

export default BlockRenderer;
