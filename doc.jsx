ScenesScenes = {
    start_page: () => {
        target = [
            'for user understand and allow to start',
            'for user re-link game'
        ]

        page_config = {
            start_btn: 'for start',
            titile: 'for user understand theme',
            input: 'numberId and name (default value)',
        }

        start_btn = () => {
            if (gamePlay.includes(user.id)) ReLinkGame()

            inputName()
                .then(name => jumpTo(ScenesScenes.readlyComfirm))
        }
    },
    readlyComfirm: () => {
        target = [
            'wait all Join',
            'show status for feedback progress'
        ]

        page_Configuration = {
            roomid: 'for password join',
            status: 'for feedback progress to user',
            user_name: 'for user modify change',
            readly_button: 'confirm/cancel readly to start play',
            NumberId: 'for game play',
            countDown: 'for user to understand get start soon'
        }

        status = {
            item: {
                config: ['NumberId', 'user_name'],
                myself: 'style red color'
            },
            readly_button: 'confirm/cancel readly to start play',
            style: {
                status_tip: {
                    position: 'left and right top center',
                    for: 'user to understand what mean is ready'
                },
                item: 'id | name',
                countDown_tip: 'for user to understand get start soon'
            }
        }

        NumberId = {
            style: 'right',
            func: 'popout to input change'
        }

        name = {
            style: 'rigth',
            func: 'popout to input change'
        }

        readly_button = () => {
            if (isRepeat(NumberId)) popOut('can`t readly to start game, because NumberId is Repeat')
            if (isRepeat(name)) popOut('can`t readly to start game, because name is Repeat')
        }
    },

    confirmPlayRole: () => {
        target = 'confirm PlayRole'

        page_Configuration = {
            cardBackground: 'for SelectGameplayMethod and hiden car',
            cardStyleAnimation: 'for user paly game Feedback',
            PlayRole: {
                Villagers: 'Normal player',
                Wlof: 'kill them',
                Profession: ['Hunter', 'Predictor', 'Witch']
            },
            NumberConfig: {
                min: {
                    number: 6,
                    Role: [Wlof, specialWlof, Villagers * 2, Predictor, Witch || Hunter],
                    Witch: 'can save myself',
                    Witch: 'when be kill can`t kill other',
                    winCondition: 'wlof kill all || kill all wlof'
                },
                minWlof: {
                    number: 7,
                    Role: [Wlof, specialWlof, Villagers * 2, Predictor, Witch || Hunter, idiot],
                    Witch: 'can`t save myself',
                    Witch: 'when be kill can`t kill other',
                    idiot: 'can`t vote out',
                    specialWlof: 'blew and take away people',
                    winCondition: 'Kill one side'
                },
                minVillagers: {
                    number: 8,
                    Role: [Wlof * 3, Villagers * 2, Predictor, Witch, Hunter],
                    winCondition: 'Kill one side'
                },
                max: {
                    number: 9,
                    Role: [Wlof * 3, Villagers * 3, Predictor, Witch, Hunter],
                    winCondition: 'Kill one side'
                }
            },
            IntoDarkBtton: 'the function confirm PlayRole and start game Formally'
        }

        showSelectPlayRole = () => {
            numberOfPeople = [6, 7, 8, 9]
            Configuration = {
                SwitchGameplayMethod: 'for user Switch Game play Method',
                UN_SelectedCardLists: 'for user to understand How many people select',
                SelectedCardLists: 'show select status',
                SelectedCard: 'for user to cancel Select'
            }
        }

        IntoDarkBtton = () => {
            if (!SelectedCard) style = hiden

            showPopout() = {
                cancelBtn: 'for user to cancel start',
                countNumberTip: 'for user to understand How many people select'
            }
        }

        showCarStyleAnimation = () => {
            if (First) Action = () => SelectGameplayMethod = [
                complete_on_line,
                physical_cards
            ]

            isSelect_on_line = !First && isSelect(SelectGameplayMethod) && SelectGameplayMethod === complete_on_line
            isSelect_physical_cards = !First && isSelect(SelectGameplayMethod) && SelectGameplayMethod === physical_cards

            if (isSelect_on_line) Action = () => {
                showDistributionlayRole()
            }

            if (isSelect_physical_cards) Action = () => {
                showSelectPlayRole()
            }
        }
    },

    IntoDark: () => {
        target = 'help for people play game'

        page_Configuration = {
            TextTip: 'tip user how to operat in the dark',
            AciveCard: 'active in the dark',
            DisableCard: 'disable in the dark',
            operatStatus: 'tip user operat status',
            confirmBtn: 'for user operat'
        }

        AciveCard = {
            cantNoHiden: 'show clear active status (event if be kill)'
        }

        DisableCard = {
            cantNoShow: 'can`t not show, for clear is disable status'
        }

        Wlof = () => {
            selectKillNumberId = () => simple
            VoiceTip = {
                OpenActive: 'tip user to operat',
                selectKillNumberId: 'tip user to kill',
                KillNumberIdConfirm: 'for user to cancle',
                closeDisable: 'tip user End Dark for wlof'
            }
        }

        Predictor = () => {
            selectPredictionNumberId = () => simple // need show confirm
            status = ['Alive', 'Away']
            VoiceTip = {
                OpenActive: 'tip user to operat',
                selectPredictionNumberId: 'tip user to kill event if be kill',
                closeDisable: 'tip user End Dark for Predictor'
            }
        }

        Witch = () => {
            selectSkillOperate = () => shouldBeSimple
            VoiceTip = {
                OpenActive: 'tip user to operat',
                selectSkillOperate: 'tip user to kill event if be kill',
                closeDisable: 'tip user End Dark for Witch'
            }
        }

        Hunter = () => {
            selectSkillOperate = () => shouldBeSimple
            VoiceTip = {
                OpenActive: 'tip user to operat',
                selectSkillOperate: 'tip user to kill event if be kill',
                closeDisable: 'tip user End Dark for Witch'
            }
        }
    },

    DayTime: () => {
        target = 'help for people play game'

        page_Configuration = {
            TextTip: 'tip user how to operat in the dark',
            Card: 'for user see myself status',
            operatStatus: 'tip user operat status',
            confirmBtn: 'for user operat'
        }

        if (FirstDay) {
            CampaignLeader()
        }
    },

    EndStatus: () => {
        target = 'for user understand result'

        page_Configuration = {
            ReStartBtn: 'for user operat re-start'
        }
    }
}
