import { urlFragments } from "../../../constants/url-fragments";
import { labels } from "../../../constants/labels";

import { PrimaryNavigationItemProps } from "./primary-navigation-item/primary-navigation-item-props.interface";

export const primaryNavigationItems: PrimaryNavigationItemProps[] = [
  {
    href: `/${urlFragments.home}`,
    label: labels.home
  },
  {
    href: `/${urlFragments.newSearch}`,
    label: labels.newSearch
  },
  {
    href: `/${urlFragments.currentSearch}`,
    label: labels.currentSearch
  }
];
