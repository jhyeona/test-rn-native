import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';
import SchedulesTable from '#containers/WeeklySchedules/components/SchedulesTable.tsx';

const WeeklySchedules = () => {
  return (
    <CSafeAreaView>
      <ScheduleHeader />
      <CView style={{display: 'flex', gap: 12}}>
        <SchedulesTable />
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
