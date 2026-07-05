import { useState, type SyntheticEvent } from "react";
import styles from "./FollowRequestsPage.module.scss";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList } from "@mui/lab";
import {
  IncomingRequestsTab,
  OutgoingRequestsTab,
} from "../../components/organisms/FollowRequests";

type TRequestTab = "incoming" | "outgoing";

export const FollowRequestsPage = () => {
  const [requestTab, setRequestTab] = useState<TRequestTab>("incoming");

  const handleChangeTab = (_: SyntheticEvent, newValue: TRequestTab) => {
    setRequestTab(newValue);
  };

  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
        <TabContext value={requestTab}>
          <Box className={styles.tabs}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChangeTab}
                aria-label="Заявки на подписку"
                variant="fullWidth"
              >
                <Tab label="Входящие заявки" value="incoming" />
                <Tab label="Исходящие заявки" value="outgoing" />
              </TabList>
            </Box>

            <IncomingRequestsTab />
            <OutgoingRequestsTab active={requestTab === "outgoing"} />
          </Box>
        </TabContext>
      </div>
    </main>
  );
};

export default FollowRequestsPage;
