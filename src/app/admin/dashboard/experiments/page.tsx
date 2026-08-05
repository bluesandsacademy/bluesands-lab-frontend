"use client";
import EngagementTable from "@/components/Admin/Experiment-Content/EngagementTable";
import ExperimentTable from "@/components/Admin/Experiment-Content/ExperimentTable";
import LearningSpaceTable, {
  subjectsOf,
} from "@/components/Admin/Experiment-Content/LearningSpaceTable";
import QuizTable from "@/components/Admin/Experiment-Content/QuizTable";
import { getGlobalUser } from "@/services/globalAdminDashboardService";
import {
  getLearningSpaces,
  type LearningSpaceSummary,
} from "@/services/learningSpaceService";
import FilterButton from "@/services/FilterButton";
import { useUser } from "@/services/UserContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaFilter, FaPlus } from "react-icons/fa";

const ALL_SUBJECTS = "All Subjects";
const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Keeps a burst of author lookups bounded on large result sets. */
const MAX_AUTHOR_LOOKUPS = 25;

const AdminExperimentsPage = () => {
  const filters = [
    "Learning Spaces",
    "Experiments",
    "Subject & Quizzes",
    "Engagement",
  ];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const engagementFilters = ["All Time", "Last 30 Days"];

  const { user, token } = useUser();

  const [spaces, setSpaces] = useState<LearningSpaceSummary[]>([]);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(ALL_SUBJECTS);

  const isSpacesTab = activeFilter === "Learning Spaces";

  const fetchSpaces = useCallback(async () => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);
    try {
      const data = await getLearningSpaces(token);
      setSpaces(data);
    } catch (err) {
      console.error("Failed to load learning spaces", err);
      setError("Could not load learning spaces. Please try again.");
      setSpaces([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, token]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // `createdBy` is a user id, so resolve it to a name for the Author column.
  useEffect(() => {
    if (!token || !spaces.length) return;

    const unresolved = [
      ...new Set(spaces.map((space) => space.createdBy).filter(Boolean)),
    ]
      .filter((id) => GUID_PATTERN.test(id) && !authorNames[id])
      .slice(0, MAX_AUTHOR_LOOKUPS);

    if (!unresolved.length) return;

    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled(
        unresolved.map((id) => getGlobalUser(id, token)),
      );
      if (cancelled) return;

      const resolved: Record<string, string> = {};
      results.forEach((result, index) => {
        const id = unresolved[index];
        if (result.status === "fulfilled") {
          resolved[id] = result.value?.fullName || result.value?.email || id;
        }
      });
      if (Object.keys(resolved).length) {
        setAuthorNames((current) => ({ ...current, ...resolved }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [spaces, token, authorNames]);

  const subjectOptions = useMemo(() => {
    const subjects = new Set<string>();
    spaces.forEach((space) => subjectsOf(space).forEach((s) => subjects.add(s)));
    return [ALL_SUBJECTS, ...[...subjects].sort()];
  }, [spaces]);

  const visibleSpaces = useMemo(() => {
    const term = search.trim().toLowerCase();
    return spaces.filter((space) => {
      if (
        subjectFilter !== ALL_SUBJECTS &&
        !subjectsOf(space).includes(subjectFilter)
      ) {
        return false;
      }
      if (!term) return true;
      return (
        (space.title ?? "").toLowerCase().includes(term) ||
        (space.objective ?? "").toLowerCase().includes(term) ||
        (space.tags ?? []).some((tag) =>
          (tag?.label ?? "").toLowerCase().includes(term),
        )
      );
    });
  }, [spaces, search, subjectFilter]);

  return (
    <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-3 lg:gap-5">
      <FilterButton
        onFilterChange={setActiveFilter}
        activeFilter={activeFilter}
        filters={filters}
      />

      <div
        className={`flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-end md:items-center p-4 rounded-md bg-white  ${
          activeFilter === "Engagement" && "hidden"
        }`}
      >
        <div className="flex text-xs md:text-sm gap-4 items-center">
          <input
            type="search"
            name="search"
            value={isSpacesTab ? search : ""}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!isSpacesTab}
            placeholder={`Search ${activeFilter}`}
            className="text-xs lg:text-sm rounded-md p-2 border border-gray-300 disabled:bg-gray-50"
          />
          <div className="flex items-center text-gray-500 rounded-md p-2 border border-gray-200">
            <FaFilter />
            <select
              name="filter"
              id="filter"
              value={isSpacesTab ? subjectFilter : ALL_SUBJECTS}
              onChange={(e) => setSubjectFilter(e.target.value)}
              disabled={!isSpacesTab}
            >
              {(isSpacesTab
                ? subjectOptions
                : [ALL_SUBJECTS, "Physics", "Chemistry", "Biology"]
              ).map((filter) => (
                <option value={filter} key={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!isSpacesTab && (
          <button className="flex gap-1 items-center text-white bg-bgBlue rounded-md text-xs lg:text-sm p-2">
            <FaPlus /> Add Experiment
          </button>
        )}
      </div>

      {activeFilter === "Engagement" && (
        <div className="flex justify-end gap-2">
          <select
            name="engagementFilter"
            id="engagementFilter"
            className="text-xs lg:text-sm rounded-md border border-gray-200 p-2"
          >
            {engagementFilters.map((filter, index) => (
              <option key={index} value="">
                {filter}
              </option>
            ))}
          </select>
          <button className="text-xs lg:text-sm border border-gray-200 rounded-md p-2">
            Export
          </button>
        </div>
      )}

      {isSpacesTab && error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {activeFilter === "Experiments" ? (
        <ExperimentTable />
      ) : activeFilter === "Subject & Quizzes" ? (
        <QuizTable />
      ) : isSpacesTab ? (
        <LearningSpaceTable
          spaces={visibleSpaces}
          isLoading={isLoading}
          authorNames={authorNames}
          onSpaceChanged={fetchSpaces}
        />
      ) : activeFilter === "Engagement" ? (
        <EngagementTable />
      ) : (
        ""
      )}
    </div>
  );
};

export default AdminExperimentsPage;
