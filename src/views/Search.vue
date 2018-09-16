<template>
    <v-layout>
        <v-flex xs12>
            <v-text-field label="Who are you looking for?" v-stream:keyup.native="userInput$"/>
            <v-list class="heroes-list" v-if="filteredNames.length">
                <template v-for="(hero, index) in filteredNames">
                    <v-list-tile @click="{}" :key="index">
                        <v-list-tile-content>{{hero.name}}</v-list-tile-content>
                    </v-list-tile>
                    <v-divider/>
                </template>
            </v-list>
            <v-subheader v-else>No results found</v-subheader>
            <div v-for="repo in searchResults">{{repo.name}}</div>
        </v-flex>
    </v-layout>
</template>

<script>
    import {debounceTime, distinctUntilChanged, map, startWith, switchMap, concatAll, scan, filter, combineLatest} from 'rxjs/operators'
    import { from } from 'rxjs/observable/from';
    import axios from 'axios';
    import vuers from '../data/vuers'

    axios.defaults.baseURL = 'https://api.github.com';
    const axiosHeader = {
        Authorization: `Bearer 116b0062e6fb7707c526c9acba6f964eccfb1728`
    };

    export default {
        data() {
            return {
                vuers
            }
        },
        computed: {
            searchString$() {
                return this.userInput$
                    .pipe(
                        map(input => input.event.target.value),
                        debounceTime(500),
                        startWith(''),
                        distinctUntilChanged(),
                    )
            },
            filtered$() {
                return this.searchString$
                    .pipe(
                        map(value => {
                            const pattern = new RegExp(value, 'i');
                            return this.vuers.filter(el => el.name.match(pattern))
                        })
                    )
            }
        },
        domStreams: ['userInput$'],
        subscriptions() {
            return {
                filteredNames: this.filtered$,
                searchResults: this.filtered$.pipe(
                    combineLatest(this.searchString$),
                    filter(([names, searchString]) => searchString.length),
                    map(([names, _]) => this.getUserRepos(names)),
                    switchMap(queries => from(queries)),
                    concatAll(),
                    map(result => result.data),
                    scan((acc, value) => {
                        acc.push(value);
                        return acc;
                    }),
                )
            }
        },
        methods: {
            getUserRepos(users) {
                return users.map(user => axios.get(`/users/${user.github}/repos?page=1&per_page=5&sort=pushed`,
                    { headers: axiosHeader }))
            }
        },
    }
</script>

<style scoped>
    .heroes-list {
        width: 100%;
    }
</style>