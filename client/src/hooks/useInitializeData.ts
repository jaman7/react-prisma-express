import { fetchProjectsDict$ } from '@/shared/services/ProjectsDictService';
import { fetchUserProjectsDict$ } from '@/shared/services/UserProjectsDictService';
import { fetchUsersDict$ } from '@/shared/services/UsersDictService';
import { useGlobalStore } from '@/store/useGlobalStore';
import { combineLatest } from 'rxjs';

export const initializeData = (userId: string) => {
  const { updateDictionary } = useGlobalStore.getState();

  const subscription = combineLatest([fetchUsersDict$(), fetchUserProjectsDict$(userId), fetchProjectsDict$()]).subscribe(
    ([usersDict, userProjectsDict, projectDict]) => {
      updateDictionary({
        usersDict,
        userProjectsDict,
        projectDict,
      });
    }
  );

  return subscription;
};
