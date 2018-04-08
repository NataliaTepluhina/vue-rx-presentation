<template>
    <v-layout row wrap>
        <v-flex md4 sm6 offset-md1>
            <div class="draggable-container elevation-5">
                <v-card
                        class="list-item"
                        v-stream:mousedown.native="{subject: mouseDown$, data: item}"
                        v-stream:mouseup.native="{subject: mouseUp$, data: item}"
                        :class="{draggable: item.draggable}"
                        color="teal accent-4"
                        v-for="(item, index) in leftList"
                        :key="index">
                    <v-card-title primary-title>
                        <div class="title">{{item.text}}</div>
                    </v-card-title>
                </v-card>
            </div>
        </v-flex>
        <v-flex md4 sm6 offset-md1>
            <div class="draggable-container elevation-5" ref="rightList">
                <v-card
                        class="list-item"
                        v-stream:mousedown.native="{subject: mouseDown$, data: item}"
                        v-stream:mouseup.native="{subject: mouseUp$, data: item}"
                        :class="{draggable: item.draggable}"
                        color="teal accent-4"
                        v-for="(item, index) in rightList"
                        :key="index">
                    <v-card-title primary-title>
                        <div class="title">{{item.text}}</div>
                    </v-card-title>
                </v-card>
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
    import {flatMap, map, takeUntil} from 'rxjs/operators'
    import {fromEvent} from 'rxjs/observable/fromEvent';

    export default {

        data() {
            return {
                leftList: [
                    {
                        text: 'Move',
                        draggable: false,
                    },
                    {
                        text: 'Elements',
                        draggable: false,
                    },
                    {
                        text: 'From',
                        draggable: false,
                    },
                    {
                        text: 'One',
                        draggable: false,
                    }, {
                        text: 'List',
                        draggable: false,
                    },
                ],
                rightList: [
                    {
                        text: 'To',
                        draggable: false,
                    },
                    {
                        text: 'Another',
                        draggable: false,
                    },
                ]
            }
        },
        domStreams: ['mouseDown$', 'mouseUp$'],
        subscriptions() {
            const mouseMove$ = fromEvent(document, 'mousemove');
            const mouseDrag$ = this.mouseDown$
                .do(event => event.data.draggable = true)
                .pipe(
                    flatMap(md => {
                        const
                            startX = md.event.offsetX,
                            startY = md.event.offsetY,
                            target = md.event.target;

                        return mouseMove$.pipe(
                            map(mm => {
                                mm.preventDefault();
                                return {
                                    left: mm.clientX - startX,
                                    top: mm.clientY - startY,
                                    target: target
                                };
                            }),
                            takeUntil(this.mouseUp$)
                        )
                    }),
                );
            return {
                drag: mouseDrag$.do(pos => {
                    pos.target.parentElement.style.top = pos.top + 'px';
                    pos.target.parentElement.style.left = pos.left + 'px';
                }),
                drop: this.mouseUp$.do(event => {
                    const box = event.event.target.parentElement.getBoundingClientRect();
                    if (box.right > this.$refs.rightList.getBoundingClientRect().left) {
                        this.leftList.splice(this.leftList.indexOf(event.data), 1);
                        this.rightList.push(event.data);
                    }
                    event.data.draggable = false;
                    event.event.target.parentElement.style.top = 0;
                    event.event.target.parentElement.style.left = 0;
                })
            }
        }
    }
</script>

<style lang="scss">
    .draggable-container {
        width: 270px;
        box-sizing: border-box;
        border: 1px solid grey;
        padding: 10px;
        margin: 0 auto;
        margin-bottom: 30px;
    }

    .list-item {
        margin-bottom: 10px;
        width: 250px;
        max-width: 100%;
        border: 1px solid black;
        cursor: grab;

        &:nth-last-child(1) {
            margin-bottom: 0;
        }
        &.draggable {
            position: absolute;
            z-index: 5;
            cursor: grabbing;
        }
    }
</style>