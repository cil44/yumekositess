/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Commands } from "./pages/Commands";
import { Privacy } from "./pages/Privacy";
import { TOS } from "./pages/TOS";
import { YumekoSocial } from "./pages/YumekoSocial";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="social" element={<YumekoSocial />} />
          <Route path="commands" element={<Commands />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="tos" element={<TOS />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
