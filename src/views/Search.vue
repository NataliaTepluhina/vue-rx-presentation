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
            <div>{{searchResults}}</div>
        </v-flex>
    </v-layout>
</template>

<script>
    import {debounceTime, distinctUntilChanged, map, startWith, switchMap, concatAll, scan} from 'rxjs/operators'
    import { from } from 'rxjs/observable/from';
    import axios from 'axios';
    import vuers from '../data/vuers'

    axios.defaults.baseURL = 'https://api.github.com';
    const axiosHeader = {
        Authorization: `Bearer 9b9a60cdf348e2e944cd7ac726c247c3cadc154e`
    };

    export default {
        data() {
            return {
                vuers
            }
        },
        computed: {
            filtered() {
                return this.userInput$
                    .pipe(
                        map(input => input.event.target.value),
                        debounceTime(500),
                        startWith(''),
                        distinctUntilChanged(),
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
                filteredNames: this.filtered,
                searchResults: this.filtered.pipe(
                    map(names => this.getUserRepos(names)),
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
                return users.map(user => axios.get(`/users/${user.github}/repos`, { headers: axiosHeader }))
            }
        },
    }
</script>

<style scoped>
    .heroes-list {
        width: 100%;
    }
</style>