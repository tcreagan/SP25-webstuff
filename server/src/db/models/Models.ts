import { dbConnector } from "db/initConnection";
import DBConnector from "../dbConnector";
import {Event, EventType} from "../../internal"
import { Model } from "./Model";
import { Page } from "./Page";
import { PageLayout } from "./PageLayout";
import { Project } from "./Project";
import { ProjectPermission } from "./ProjectPermission";
import { Role } from "./Role";
import { SectionLayout } from "./SectionLayout";
import { SitePermission } from "./SitePermissions";
import { User } from "./User";
import { UserType } from "./UserType";
import { Widget } from "./Widget";
import { Session } from "./Session";

export function ModelBuilder(connector:DBConnector) {
  Model.DbConnector = connector;
  return {
    User: User,
    Project: Project,
    Page: Page,
    Role: Role,
    ProjectPermission: ProjectPermission,
    UserType: UserType,
    SitePermission: SitePermission,
    EventType: EventType,
    Event: Event,
    SectionLayout: SectionLayout,
    PageLayout: PageLayout,
    Widget: Widget,
    Session: Session
  }
}
