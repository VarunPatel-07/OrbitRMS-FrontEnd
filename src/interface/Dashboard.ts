import { OrganizationHolidays } from './OrganizationSettings';
import { GlobalContextStore } from './UserProfileInterface';

export interface DashboardPlaygroundPropsInterface {
  holidayData: OrganizationHolidays[];
  GlobalStateProvider: GlobalContextStore;
}
export interface HolidayedPropsInterFace {
  holidayData: OrganizationHolidays[];
  GlobalStateProvider: GlobalContextStore;
}
