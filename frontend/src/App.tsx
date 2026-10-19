import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { BudgetPage } from "@/pages/BudgetPage";
import { DependenciesPage } from "@/pages/DependenciesPage";
import { DepartmentsPage } from "@/pages/DepartmentsPage";
import { IssuesPage } from "@/pages/IssuesPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { PeoplePage } from "@/pages/PeoplePage";
import { DepartmentDetailPage } from "@/pages/DepartmentDetailPage";
import { PersonDetailPage } from "@/pages/PersonDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<OverviewPage />} />

          <Route path="/departments" element={<DepartmentsPage />} />

          <Route path="/dependencies" element={<DependenciesPage />} />

          <Route path="/budget" element={<BudgetPage />} />

          <Route path="/people" element={<PeoplePage />} />

          <Route path="/people/:researcherId" element={<PersonDetailPage />} />

          <Route path="/issues" element={<IssuesPage />} />
          <Route
            path="/departments/:deptId"
            element={<DepartmentDetailPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
