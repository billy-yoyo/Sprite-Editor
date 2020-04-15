

const I18N = {
    Languages: {
        en: {
            'create_sprite_title': 'New sprite',
            'create_sprite_button': 'Create Sprite',
            'create_sprite_name': 'Name',
            'create_sprite_width': 'Width',
            'create_sprite_height': 'Height',
            'create_sprite_frames': 'Layers',

            'create_project_title': 'New project',
            'create_project_button': 'Create Project',
            'create_project_name': 'Project Name',
            'create_project_warning': 'This will delete your current project, you can export your current project first to save it for later',

            'file_tab': 'File',
            'file_tab_new_sprite': 'New Sprite...',
            'file_tab_new_project': 'New Project...',
            'file_tab_open_project': 'Open Project...',
            'file_tab_save_project': 'Save Project',
            'file_tab_export_project': 'Export Project',
            'file_tab_rename_project': 'Rename Project...',

            'view_tab': 'View',
            'view_tab_change_pixel_size': 'Change Pixel Size...',
            'view_tab_animation_controls': 'Animation Controls...',

            'frame_tab': 'Layer',
            'frame_tab_change_dimensions': 'Change Dimensions...',

            'change_frame_dimensions_title': 'Change dimensions',
            'change_frame_dimensions_button': 'Change',
            'change_frame_dimensions_width': 'Width',
            'change_frame_dimensions_height': 'Height',

            'change_pixel_size_title': 'Change pixel size',
            'change_pixel_size_button': 'Change',
            'change_pixel_size_label': 'Pixel size',


            'default_form_submit_button': 'Submit',

            'default_frame_name': 'Layer',

            'delete_frame_title': 'Delete layer',
            'delete_frame_warning': 'Are you sure you want to delete layer \'${name}\'?',
            'delete_frame_yes_button': 'Delete layer',
            'delete_frame_no_button': 'Cancel',

            'rename_frame_title': 'Rename layer',
            'rename_frame_button': 'Rename',
            'rename_frame_new_name': 'New name',

            'frame_dropdown_hide': 'Hide',
            'frame_dropdown_show': 'Show',
            'frame_dropdown_rename': 'Rename...',
            'frame_dropdown_duplicate': 'Duplicate',
            'frame_dropdown_delete': 'Delete...',
            'frame_dropdown_child_frame': 'New Child',
            
            'frame_list_new_frame': 'New Layer',
            'frame_list_change_dimensions': 'Change Dimensions...',
            'frame_list_show_all': 'Show all',
            'frame_list_hide_all': 'Hide all',
            
            'rename_sprite_title': 'Rename sprite',
            'rename_sprite_button': 'Rename',
            'rename_sprite_new_name': 'New name',

            'delete_sprite_title': 'Delete sprite',
            'delete_sprite_warning': 'Are you sure you want to delete sprite \'${name}\'?',
            'delete_sprite_yes_button': 'Delete Sprite',
            'delete_sprite_no_button': 'Cancel',

            'sprite_dropdown_rename': 'Rename...',
            'sprite_dropdown_duplicate': 'Duplicate',
            'sprite_dropdown_delete': 'Delete...',

            'sprite_list_new_sprite': 'New Sprite...',

            'sprite_tab_close': 'Close',

            'page_title': 'Sprite Editor - ${projectName}',

            'default_filename': 'sprites.json',

            'sprite_list_title': 'SPRITE LIST',
            'frame_list_title': 'LAYER LIST',

            'default_sprite_name': 'Sprite ${index}',

            'rename_project_title': 'Rename project',
            'rename_project_button': 'Rename Project',
            'rename_project_new_name': 'New name',

            'copy': 'copy',

            'animation_controls_title': 'Animation',
            'animation_controls_play_button': 'Play',
            'animation_controls_pause_button': 'Pause',
            'animation_controls_interval_label': 'Interval',
        }
    },
    defaultLanguage: 'en',
    language: localStorage.getItem('language') || 'en'
};

function i18n(key, obj) {
    const language = I18N.Languages[I18N.language];
    let phrase;
    if (language && language[key]) {
        phrase = language[key];
    } else {
        phrase = I18N.Languages[I18N.defaultLanguage][key];
    }

    if (!phrase) {
        console.warn(`failed to find text for i18n key ${key}`);
        return '';
    } 

    if (obj) {
        Object.keys(obj).forEach((name) => {
            const value = obj[name];
            phrase = phrase.replace(new RegExp('\\$\\{' + name + '\\}', 'g'), value);
        });
    }

    return phrase;
}

function setLanguage(language) {
    I18N.language = language;
    localStorage.setItem('language', language);
}
