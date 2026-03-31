import { TeamOrgLeaveModuleHeaderInterface } from '@/interface/LeavesModule.interface';
import { TeamLeaveSummaryCard } from '@/modules/leaves/components/LeavesBalanceCard';

function TeamOrgLeaveModuleHeader({
  GlobalStateProvider,
  data,
}: TeamOrgLeaveModuleHeaderInterface) {
  return (
    <div className='w-full flex items-stretch max-w-full flex-nowrap gap-4 overflow-auto hide-scrollbar'>
      <TeamLeaveSummaryCard
        cardTitle='Current Date'
        renderDate={true}
        default_dateformat={
          GlobalStateProvider?.organization?.organization_settings
            ?.default_dateformat
        }
      />
      <TeamLeaveSummaryCard
        cardTitle='Total On Leave'
        value={`${data?.employees_on_leave}/${data?.total_employees}`}
        renderDate={false}
      />
      <TeamLeaveSummaryCard
        cardTitle='Planned Leaves'
        value={data?.planned_leaves}
        renderDate={false}
      />
      <TeamLeaveSummaryCard
        cardTitle='Unplanned Leaves'
        value={data?.unplanned_leaves}
        renderDate={false}
      />
      <TeamLeaveSummaryCard
        cardTitle='Total Pending Leaves'
        value={data?.pending_leaves}
        renderDate={false}
      />

      <TeamLeaveSummaryCard
        cardTitle='Total Cancelled Leaves'
        value={data?.cancelled_leaves}
        renderDate={false}
      />
    </div>
  );
}

export default TeamOrgLeaveModuleHeader;
