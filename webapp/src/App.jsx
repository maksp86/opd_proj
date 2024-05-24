import Home from './pages/Home.jsx'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Container, Modal } from 'react-bootstrap'

import Navigation from "./components/Navigation"
import TopBar from './components/TopBar.jsx'

import Account from './pages/Account.jsx'
import NotFound from './pages/NotFound.jsx'
import LoginPage from './pages/Login.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import Taskchoose from './pages/Taskchoose.jsx'
import Leaningchoose from './pages/Leaningchoose.jsx'

import './main.scss'
import { UserContext } from './context/user.context.js'
import { ApiContext } from './context/api.context.js'
import { useModal } from './hooks/modal.hook.js'
import { useApi } from './hooks/api.hook.js'
import { useUser } from './hooks/user.hook.js'
import { useConstructor } from './hooks/constructor.hook.js'
import { useEffect } from 'react'
import { ModalContext } from './context/modal.context.js'
import ErrorMessageModal from './pages/modals/ErrorMessageModal.jsx'
import CategoryEditPage from './pages/CategoryEditPage.jsx'


function App() {
    const apiHook = useApi();
    const userHook = useUser();
    const modalHook = useModal();

    async function fetchUserStats() {
        userHook.setUpdateRequest(false)
        let result = await apiHook.request("/stats/user?id=" + userHook.user._id)

        if (result) {
            userHook.updateUser(result.data.value.foundUser)
            userHook.setComputedXp(result.data.value.rating)
        }
    }

    useConstructor(() => {
        userHook.load();
        userHook.setUpdateRequest(true);
    })

    useEffect(() => {
        if (userHook.loggedIn && userHook.updateRequest) {
            fetchUserStats();
        }
    }, [userHook.loggedIn, userHook.updateRequest])

    useEffect(() => {
        if (apiHook.error && !apiHook.error.preventNext) {
            console.log("api error in app.jsx ", JSON.stringify(apiHook.error))
            if (apiHook.error.status === "error_not_logined" && apiHook.error.httpcode === 403)
                userHook.logout();
            else {
                modalHook.show(<ErrorMessageModal error={apiHook.error} />)
            }

            apiHook.clearError();
        }
    }, [apiHook.error])

    return (
        <ApiContext.Provider value={apiHook}>
            <UserContext.Provider value={userHook}>
                <ModalContext.Provider value={modalHook}>
                    <Modal
                        show={modalHook.isOpen}
                        onHide={() => modalHook.close()}
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        backdrop={modalHook.isClosable ? true : "static"}
                        keyboard={modalHook.isClosable}
                    >
                        <Modal.Body>
                            {modalHook.content}
                        </Modal.Body>
                    </Modal>
                    <BrowserRouter>
                        <TopBar user={userHook.user} />
                        <Container>
                            <Routes>
                                <Route path='/' element={<Home />} />
                                {(!userHook.loggedIn) &&
                                    <>
                                        <Route path='/login' element={<LoginPage />} />
                                        <Route path='*' element={<Navigate replace to="/login" />} />
                                    </>
                                }

                                {userHook.loggedIn &&
                                    <>
                                        <Route path='/account' element={<Account />} />
                                        <Route path='/learning' key="learning" element={<CategoriesPage isLearning={true} />} />
                                        <Route path='/learning/:category' element={<Leaningchoose />} />
                                        <Route path='/tasks' element={<CategoriesPage key="tasks" isLearning={false} />} />
                                        <Route path='/tasks/:category' element={<Taskchoose />} />
                                        <Route path='/category/edit/' element={<CategoryEditPage />} />
                                        <Route path='*' element={<NotFound />} />
                                    </>
                                }

                            </Routes>
                        </Container>
                        <Navigation />
                    </BrowserRouter>
                </ModalContext.Provider>
            </UserContext.Provider>
        </ApiContext.Provider>
    )
}

export default App;