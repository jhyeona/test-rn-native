import TimeTable from '#components/Calendar/TimeTable.tsx';
import CSafeAreaView from '#components/common/CommonView/CSafeAreaView.tsx';
import CView from '#components/common/CommonView/CView.tsx';
import AcademySelector from '#components/Schedule/AcademySelector.tsx';
import ScheduleHeader from '#components/Schedule/ScheduleHeader.tsx';

const WeeklySchedules = () => {
  return (
    <CSafeAreaView>
      <ScheduleHeader />
      <CView>
        <AcademySelector />
        <TimeTable />
      </CView>
    </CSafeAreaView>
  );
};

export default WeeklySchedules;
