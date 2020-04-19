import { BreadcrumbProps } from "../../shared/breadcrumb/breadcrumb-props.interface";
import { SearchInfoProps } from "./search-info/search-info-props.interface";
import { BoardInfoProps } from "./board-info/board-info-props.interface";

export interface CurrentSearchPageState {
  prepared: boolean;
  started: boolean;
  completed: boolean;
  breadcrumb: BreadcrumbProps;
  searchInfo: SearchInfoProps;
  boardInfoItems: BoardInfoProps[];
}
